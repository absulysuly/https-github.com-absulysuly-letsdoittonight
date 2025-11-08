import React, { useState, useEffect } from 'react';
import { Language } from '../../../types.ts';
import { UI_TEXT } from '../../../translations.ts';
import * as api from '../../../services/apiService.ts';
import { Election } from '../types.ts';
import Card from '../components/ui/Card.tsx';
import Input from '../components/ui/Input.tsx';
import Select from '../components/ui/Select.tsx';
import Button from '../components/ui/Button.tsx';
import ManagementPageHeader from '../components/ManagementPageHeader.tsx';
import { DocumentIcon } from '../../icons/Icons.tsx';

interface ElectionsPageProps {
    language: Language;
    onNavigate: (path: string) => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getClasses = () => {
        switch (status) {
            case 'active': return 'status-active';
            case 'inactive': return 'status-inactive';
            case 'pending': return 'status-pending';
            default: return 'bg-gray-200 text-gray-800';
        }
    };
     return <span className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg bg-opacity-50 ${getClasses()}`}>{status}</span>;
}

const ElectionsPage: React.FC<ElectionsPageProps> = ({ language, onNavigate }) => {
    const [elections, setElections] = useState<Election[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [formState, setFormState] = useState({ name: '', status: 'pending', startDate: '', endDate: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const texts = UI_TEXT[language];

    const fetchElections = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await api.getElections();
            setElections(data);
        } catch (err) {
            setError('Failed to fetch elections.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchElections();
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const newElection = await api.createElection({
                name: formState.name,
                status: formState.status as 'pending' | 'active' | 'inactive',
                startDate: new Date(formState.startDate).toISOString(),
                endDate: new Date(formState.endDate).toISOString(),
            });
            setElections(prev => [newElection, ...prev]);
            setFormState({ name: '', status: 'pending', startDate: '', endDate: ''}); // Reset form
            alert(texts.electionCreatedSuccess);
        } catch(err) {
             setError('Failed to create election.');
             console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ManagementPageHeader
                title={texts.elections}
                description="Manage all election records. Create new elections and view the status and dates of existing ones."
                onBack={() => onNavigate('/dashboard')}
                icon={<DocumentIcon className="w-8 h-8 text-formal-primary-600" />}
            />

            <Card className="mb-8">
                <h3 className="text-xl font-bold mb-4">{texts.newElection}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="lg:col-span-2">
                        <Input id="name" name="name" label={texts.electionName} value={formState.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <Select id="status" name="status" label={texts.electionStatus} value={formState.status} onChange={handleInputChange}>
                            <option value="pending">{texts.status.pending}</option>
                            <option value="active">{texts.status.active}</option>
                            <option value="inactive">{texts.status.inactive}</option>
                        </Select>
                    </div>
                    <div>
                        <Input id="startDate" name="startDate" label={texts.startDate} type="datetime-local" value={formState.startDate} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <Input id="endDate" name="endDate" label={texts.endDate} type="datetime-local" value={formState.endDate} onChange={handleInputChange} required />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? texts.submitting : texts.createElection}</Button>
                </form>
            </Card>

            <Card>
                 <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-official-800/20">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">Name</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Status</th>
                                <th className="p-3 text-sm font-semibold tracking-wide hidden md:table-cell">Start Date</th>
                                <th className="p-3 text-sm font-semibold tracking-wide hidden md:table-cell">End Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-official-300">
                             {isLoading ? (
                                <tr><td colSpan={4} className="p-8 text-center">{texts.loading}</td></tr>
                            ) : error ? (
                                <tr><td colSpan={4} className="p-8 text-center text-red-500">{error}</td></tr>
                            ) : elections.length > 0 ? (
                                elections.map((election) => (
                                    <tr key={election.id} className="hover:bg-official-200/50">
                                        <td className="p-3 font-bold">{election.name}</td>
                                        <td className="p-3"><StatusBadge status={election.status} /></td>
                                        <td className="p-3 text-sm hidden md:table-cell">{new Date(election.startDate).toLocaleString()}</td>
                                        <td className="p-3 text-sm hidden md:table-cell">{new Date(election.endDate).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="p-8 text-center">{texts.noElectionsFound}</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </Card>
        </div>
    );
};

export default ElectionsPage;
