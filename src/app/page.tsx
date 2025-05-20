"use client"
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Home() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', phone: '', street: '', state: '', zip: '', ssn: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    axios.get('/api/investor').then(res => {
      setCount(res.data?.count || 0);
    });
  }, []);

  //TODO: Add validation for each field if needed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files && e.target.files[0]);

  const resetForm = () => {
    setForm(Object.fromEntries(Object.keys(form).map(key => [key, ''])) as typeof form);
    setFile(null);
    setProgress(0);
    setError(null);
    formRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) formData.append(key, value);
      if (file) {
        formData.append('document', file);
      }

      await axios.post('/api/investor', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer secure-mock-token' //Authorization header
        },
        onUploadProgress: (e) => {
          const percent = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
          setProgress(percent);
        }
      });
      resetForm();
      setSuccess('Investor submitted successfully!');
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unexpected error occurred';
      setError(message);
    }
  };

  return (
    <div className="p-8 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8">
        Investor Dashboard
        <div className="text-gray-600 text-sm mb-2">Total Investors in DB: {count}</div>
        <form ref={formRef} onSubmit={handleSubmit} data-testid="investor-form" className="grid grid-cols-1 gap-4 w-full max-w-md">
          <input name="firstName" data-testid="input-firstName" required placeholder="First Name" onChange={handleChange} className="border p-2 rounded" />
          <input name="lastName" data-testid="input-lastName" required placeholder="Last Name" onChange={handleChange} className="border p-2 rounded" />
          <input type="date" name="dob" data-testid="input-dob" required onChange={handleChange} className="border p-2 rounded" />
          <input name="phone" data-testid="input-phone" required placeholder="Phone" onChange={handleChange} className="border p-2 rounded" />
          <input name="street" data-testid="input-street" required placeholder="Street" onChange={handleChange} className="border p-2 rounded" />
          <input name="state" data-testid="input-state" required placeholder="State" onChange={handleChange} className="border p-2 rounded" />
          <input name="zip" data-testid="input-zip" required placeholder="Zip" onChange={handleChange} className="border p-2 rounded" />
          <input name="ssn" data-testid="input-ssn" required placeholder="SSN" onChange={handleChange} className="border p-2 rounded" />
          <input type="file" name="document" data-testid="input-document" required onChange={handleFile} className="border p-2 rounded" />
          <progress value={progress} max="100" className="w-full" />
          {(error || success) && (
            <div className={`mb-4 ${error ? 'text-red-600' : 'text-green-600'}`}>
              {error || success}
            </div>
          )}
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Submit</button>
        </form>
      </div>
    </div>
  );
}
