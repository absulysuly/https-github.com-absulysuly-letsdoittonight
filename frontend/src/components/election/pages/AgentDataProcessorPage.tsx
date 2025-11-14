import React, { useEffect, useState } from 'react';
import ManagementPageHeader from '../components/ManagementPageHeader.tsx';
import { SparklesIcon } from '../../icons/Icons.tsx';
import Card from '../components/ui/Card.tsx';
import Button from '../components/ui/Button.tsx';
import JsonViewer from '../components/JsonViewer.tsx';
import Spinner from '../../Spinner.tsx';
import Textarea from '../components/ui/Textarea.tsx';
import * as api from '../../../services/apiService.ts';

// --- Logic replicated from the user's Node.js script ---

function detectLanguage(text: string): 'ar' | 'ku' | 'en' | 'unknown' {
  if (!text) return "unknown";
  const arabic = /[\u0600-\u06FF]/;
  const kurdish = /[\u06A9\u06AF\u06A4\u06D5\u06CE\u06C6\u06C8\u06C7]/; // Specific Kurdish characters
  const latin = /[A-Za-z]/;
  if (kurdish.test(text)) return "ku";
  if (arabic.test(text)) return "ar";
  if (latin.test(text)) return "en";
  return "unknown";
}

function extractEntries(obj: any): any[] {
  if (Array.isArray(obj)) return obj.flatMap(extractEntries);
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj.records)) return extractEntries(obj.records);
    if (Array.isArray(obj.data)) return extractEntries(obj.data);
    if (Array.isArray(obj.entries)) return extractEntries(obj.entries);
    return [obj];
  }
  return [];
}

function guessCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("post")) return "posts";
  if (lower.includes("comment")) return "comments";
  if (lower.includes("social")) return "social_sites";
  if (lower.includes("candidate")) return "candidate_profiles";
  return "misc";
}

// --- Component ---

const AgentDataProcessorPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [inputMode, setInputMode] = useState<'files' | 'text'>('files');
    const [files, setFiles] = useState<File[]>([]);
    const [textInput, setTextInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<object | null>(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [statusError, setStatusError] = useState('');
    const [statuses, setStatuses] = useState<Array<{ agent: string; healthy: boolean; lastRunAt?: string; tasksCompleted: number }>>([]);
    const [loadingStatuses, setLoadingStatuses] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadStatuses = async () => {
            try {
                setLoadingStatuses(true);
                setStatusError('');
                const response = await api.getAgentStatuses();
                if (isMounted && response?.agents) {
                    setStatuses(response.agents);
                }
            } catch (err: any) {
                if (isMounted) {
                    setStatusError(err?.message ?? 'Unable to load agent statuses');
                }
            } finally {
                if (isMounted) {
                    setLoadingStatuses(false);
                }
            }
        };
        loadStatuses();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleFileChange = (selectedFiles: FileList | null) => {
        if (selectedFiles) {
            const jsonFiles = Array.from(selectedFiles).filter(file => file.type === 'application/json' || file.name.endsWith('.json'));
            setFiles(prev => [...prev, ...jsonFiles]);
        }
    };

    const parsePastedText = (text: string): { name: string; content: string }[] => {
        const fileDelimiter = /--- START OF FILE application\/json ---/g;
        const chunks = text.split(fileDelimiter).filter(chunk => chunk.trim());
        if (chunks.length === 0 && text.trim().startsWith('{')) {
            // Handle case where user pastes a single JSON object without delimiters
             try {
                JSON.parse(text.trim());
                return [{
                    name: 'pasted_data_1.json',
                    content: text.trim()
                }];
            } catch (e) {
                return [];
            }
        }
        return chunks.map((chunk, index) => ({
            name: `pasted_data_${index + 1}.json`,
            content: chunk.trim()
        }));
    };

    const handleProcess = async () => {
        setError('');
        setProcessing(true);
        setResult(null);

        let fileData: { name: string; content: string }[] = [];

        if (inputMode === 'files') {
            if (files.length === 0) {
                setError('Please select at least one JSON file.');
                setProcessing(false);
                return;
            }
            const fileReadPromises = files.map(file => 
                new Promise<{ name: string; content: string }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ name: file.name, content: reader.result as string });
                    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
                    reader.readAsText(file);
                })
            );
            try {
                fileData = await Promise.all(fileReadPromises);
            } catch (err: any) {
                setError(err.message);
                setProcessing(false);
                return;
            }
        } else { // text mode
            if (!textInput.trim()) {
                setError('Please paste your JSON data.');
                setProcessing(false);
                return;
            }
            fileData = parsePastedText(textInput);
            if (fileData.length === 0) {
                setError('Could not find valid JSON objects in the pasted text. Ensure each JSON object is separated by "--- START OF FILE application/json ---".');
                setProcessing(false);
                return;
            }
        }

        const unified: Record<string, any> = {};

        for (const { name, content } of fileData) {
            const agentKey = (name || `agent_${Date.now()}`).replace('.json', '').replace(/[\s\W]/g, '_');
            try {
                const data = JSON.parse(content);
                const sections = [];

                if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                     for (const [key, value] of Object.entries(data)) {
                        const cat = guessCategory(key);
                        const entries = extractEntries(value);
                        const processedEntries = entries.map(entry => {
                            const textFields = Object.values(entry).filter(v => typeof v === 'string').join(" ");
                            const lang = detectLanguage(textFields);
                            return { ...entry, language: lang };
                        });

                        if (processedEntries.length > 0) {
                            sections.push({
                                category: cat,
                                description: `Auto-detected section for ${cat.replace("_", " ")}.`,
                                entries: processedEntries,
                            });
                        }
                    }
                }
                
                if (sections.length === 0) {
                    const flat = extractEntries(data).map(entry => {
                        const textFields = Object.values(entry).filter(v => typeof v === 'string').join(" ");
                        const lang = detectLanguage(textFields);
                        return { ...entry, language: lang };
                    });
                    if (flat.length > 0) {
                        sections.push({
                            category: "general",
                            description: "Ungrouped agent data (auto-flattened).",
                            entries: flat,
                        });
                    }
                }
                
                if (sections.length > 0) {
                     unified[agentKey] = {
                        meta: {
                            original_file: name,
                            records_count: sections.reduce((a, s) => a + s.entries.length, 0),
                            processed_at: new Date().toISOString(),
                        },
                        sections,
                    };
                } else {
                    unified[agentKey] = { meta: { original_file: name }, error: 'No processable entries found in the file.' };
                }

            } catch (err: any) {
                unified[agentKey] = { meta: { original_file: name }, error: `Failed to parse or process: ${err.message}` };
            }
        }
        setResult(unified);
        setProcessing(false);
    };

    const handleDownload = () => {
        if (!result) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "unified_agents.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(JSON.stringify(result, null, 2))
            .then(() => alert('Copied to clipboard!'))
            .catch(() => alert('Failed to copy.'));
    };

    const handleClear = () => {
        setFiles([]);
        setTextInput('');
        setResult(null);
        setError('');
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ManagementPageHeader
                title="Agent Data Processor"
                description="Upload or paste multiple JSON files from your agents to merge, analyze, and structure them into a single unified dataset, ready for import."
                onBack={() => onNavigate('/')}
                icon={<SparklesIcon className="w-8 h-8 text-formal-primary-600" />}
            />

            <Card className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Agent Health</h3>
                {loadingStatuses ? (
                    <div className="flex items-center gap-3 text-sm text-official-700">
                        <Spinner />
                        <span>Loading agent statuses...</span>
                    </div>
                ) : statusError ? (
                    <p className="text-sm text-red-500">{statusError}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {statuses.map(status => (
                            <div key={status.agent} className="p-4 rounded-lg border border-official-300 bg-white/10">
                                <p className="text-sm font-semibold uppercase tracking-wide text-official-700">{status.agent}</p>
                                <p className={`mt-1 text-xl font-bold ${status.healthy ? 'text-emerald-600' : 'text-amber-500'}`}>
                                    {status.healthy ? 'Operational' : 'Attention Needed'}
                                </p>
                                <p className="text-xs text-official-700 mt-2">Completed tasks: {status.tasksCompleted}</p>
                                {status.lastRunAt && (
                                    <p className="text-xs text-official-600">Last run: {new Date(status.lastRunAt).toLocaleString()}</p>
                                )}
                            </div>
                        ))}
                        {statuses.length === 0 && (
                            <p className="text-sm text-official-700">No agent runs have been recorded yet.</p>
                        )}
                    </div>
                )}
            </Card>

            <Card className="mb-6">
                 <div className="flex border-b border-official-300 mb-4">
                    <button onClick={() => setInputMode('files')} className={`px-4 py-2 text-sm font-semibold ${inputMode === 'files' ? 'text-formal-primary-600 border-b-2 border-formal-primary-600' : 'text-official-700'}`}>Upload Files</button>
                    <button onClick={() => setInputMode('text')} className={`px-4 py-2 text-sm font-semibold ${inputMode === 'text' ? 'text-formal-primary-600 border-b-2 border-formal-primary-600' : 'text-official-700'}`}>Paste Text</button>
                </div>

                {inputMode === 'files' ? (
                    <>
                        <div 
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files); }}
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver ? 'border-formal-primary-500 bg-formal-primary-100/50' : 'border-official-300'}`}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept=".json,application/json"
                                className="hidden"
                                onChange={(e) => handleFileChange(e.target.files)}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <p className="text-official-800">Drag & drop your JSON files here, or click to select.</p>
                                <p className="text-sm text-official-700 mt-1">Files will be processed in your browser.</p>
                            </label>
                        </div>
                        {files.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold mb-2">Selected Files ({files.length}):</h4>
                                <ul className="max-h-32 overflow-y-auto bg-official-100 rounded p-2 text-sm space-y-1">
                                    {files.map((file, i) => <li key={i} className="truncate">{file.name}</li>)}
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <Textarea
                        label="Paste your raw text data here"
                        id="json-input"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={10}
                        placeholder={'--- START OF FILE application/json ---\n{ "key": "value" }\n--- START OF FILE application/json ---\n{ "another": "object" }'}
                    />
                )}
                
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="flex items-center justify-end gap-4 mt-4">
                    <Button type="button" variant="secondary" onClick={handleClear} disabled={processing}>Clear All</Button>
                    <Button type="button" onClick={handleProcess} disabled={processing || (inputMode === 'files' && files.length === 0) || (inputMode === 'text' && !textInput.trim())}>
                        {processing ? 'Processing...' : 'Process Data'}
                    </Button>
                </div>
            </Card>
            
            {processing && <Spinner />}

            {result && (
                <Card>
                    <div className="flex justify-between items-center border-b border-official-300 pb-2 mb-4">
                        <h3 className="text-lg font-bold text-official-900">
                            Unified JSON Output
                        </h3>
                        <div className="flex gap-2">
                             <Button type="button" variant="secondary" onClick={handleCopy}>Copy</Button>
                             <Button type="button" onClick={handleDownload}>Download</Button>
                        </div>
                    </div>
                    <JsonViewer jsonData={result} />
                </Card>
            )}
        </div>
    );
};

export default AgentDataProcessorPage;