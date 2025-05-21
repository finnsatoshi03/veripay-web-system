import { useEffect, useState } from 'react';
import { getProfile } from '@/services/employee/ProfileService';
import { getAccountRequest } from '@/services/hr/EmployeeService';
export default function LoginPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getAccountRequest();

        if (!data){
          console.log("no user found");
          return;  
        }
        
        setData(data);

      } catch (err) {
        setError(err);
      }
    };

    fetchProfile();
  }, []);

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
