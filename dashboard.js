
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function DashboardPage() {
    const [leads, setLeads] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return router.push('/login');

        fetch('http://localhost:4000/api/leads', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(setLeads)
        .catch(() => router.push('/login'));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {leads.map(lead => (
                <div key={lead.id}>
                    <strong>{lead.name}</strong>: {lead.email}
                </div>
            ))}
        </div>
    );
}
