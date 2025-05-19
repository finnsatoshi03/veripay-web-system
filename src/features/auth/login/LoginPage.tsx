import { useEffect, useState } from 'react';
import { getProfile } from '@/services/employee/ProfileService';


export default function LoginPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(24);
        setData(response);
      } catch (err) {
        setError(err);
      }
    };

    fetchProfile();
  )}
  return (
    <div style={{ padding: '1rem' }}>
      <h1>API Test: Profile</h1>
      {error && <pre style={{ color: 'red' }}>{JSON.stringify(error, null, 2)}</pre>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
