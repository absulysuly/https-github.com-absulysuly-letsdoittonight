import React, { useState } from 'react';
import ManagementPageHeader from '../components/ManagementPageHeader.tsx';
import { DatabaseIcon } from '../../icons/Icons.tsx';
import Card from '../components/ui/Card.tsx';
import Textarea from '../components/ui/Textarea.tsx';
import Button from '../components/ui/Button.tsx';
import JsonViewer from '../components/JsonViewer.tsx';

const RawDataViewerPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [parsedJson, setParsedJson] = useState<object | null>(null);
    const [error, setError] = useState('');

    const handleParse = () => {
        setError('');
        setParsedJson(null);
        if (!jsonInput.trim()) {
            setError('Input is empty. Please paste your JSON data.');
            return;
        }
        try {
            const parsed = JSON.parse(jsonInput);
            setParsedJson(parsed);
        } catch (e: any) {
            setError('Invalid JSON format: ' + e.message);
        }
    };

    const handleClear = () => {
        setJsonInput('');
        setParsedJson(null);
        setError('');
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ManagementPageHeader
                title="Raw Data Viewer"
                description="Paste JSON data collected by your agents to visualize it in a structured, readable format."
                onBack={() => onNavigate('/')}
                icon={<DatabaseIcon className="w-8 h-8 text-formal-primary-600" />}
            />

            <Card className="mb-6">
                <form onSubmit={(e) => { e.preventDefault(); handleParse(); }}>
                    <Textarea
                        label="Paste your JSON data here"
                        id="json-input"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows={10}
                        placeholder='{ "key": "value", "nested": { "id": 123 } }'
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="flex items-center justify-end gap-4 mt-4">
                        <Button type="button" variant="secondary" onClick={handleClear}>Clear</Button>
                        <Button type="submit">Parse & View</Button>
                    </div>
                </form>
            </Card>

            {parsedJson && (
                <Card>
                    <h3 className="text-lg font-bold text-official-900 border-b border-official-300 pb-2 mb-4">
                        JSON Tree View
                    </h3>
                    <JsonViewer jsonData={parsedJson} />
                </Card>
            )}
        </div>
    );
};

export default RawDataViewerPage;
