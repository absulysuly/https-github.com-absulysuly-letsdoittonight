import React, { useState } from 'react';

const JsonValue: React.FC<{ value: any }> = ({ value }) => {
    const type = typeof value;
    let className = 'text-official-700';
    let displayValue = String(value);

    if (type === 'string') {
        className = 'text-green-600';
        displayValue = `"${value}"`;
    } else if (type === 'number') {
        className = 'text-blue-600';
    } else if (type === 'boolean') {
        className = 'text-purple-600 font-bold';
    } else if (value === null) {
        className = 'text-gray-500';
        displayValue = 'null';
    }
    return <span className={className}>{displayValue}</span>;
}

interface JsonNodeProps {
    data: any;
    nodeKey: string;
    isRoot?: boolean;
}

const JsonNode: React.FC<JsonNodeProps> = ({ data, nodeKey, isRoot = false }) => {
    const [isExpanded, setIsExpanded] = useState(isRoot);

    const isObject = typeof data === 'object' && data !== null;

    if (!isObject) {
        return (
            <div className="ml-6 my-1">
                <span className="text-formal-primary-600 font-semibold">{nodeKey}: </span>
                <JsonValue value={data} />
            </div>
        );
    }

    const isArray = Array.isArray(data);
    const keys = Object.keys(data);
    const bracketOpen = isArray ? '[' : '{';
    const bracketClose = isArray ? ']' : '}';
    const itemsLabel = isArray ? `${keys.length} items` : `${keys.length} keys`;

    return (
        <div className="font-mono text-sm">
            <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer flex items-center hover:bg-official-200/50 rounded p-1">
                <span className="w-4 text-official-700">{isExpanded ? '▼' : '►'}</span>
                <span className="text-formal-primary-600 font-semibold">{nodeKey}:</span>
                <span className="ml-2 text-official-700">{bracketOpen}</span>
                {!isExpanded && <span className="text-official-700 ml-1">...{bracketClose} <span className="text-xs italic ml-2">{itemsLabel}</span></span>}
            </div>
            {isExpanded && (
                <div className="pl-5 border-l-2 border-official-200 ml-2">
                    {keys.map(key => (
                        <JsonNode key={key} nodeKey={key} data={(data as any)[key]} />
                    ))}
                    <span className="text-official-700">{bracketClose}</span>
                </div>
            )}
        </div>
    );
};

interface JsonViewerProps {
    jsonData: object;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ jsonData }) => {
    return <JsonNode data={jsonData} nodeKey="(root)" isRoot={true} />;
};

export default JsonViewer;