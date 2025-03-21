'use client';

import { useState } from 'react';
import { addWeightRecord } from '@/actions/weight';

export default function WeightForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    
    // Add the unit to the form data
    formData.append('unit', unit);
    
    try {
      await addWeightRecord(formData);
      setSuccess(true);
      
      // Reset the form
      const form = document.getElementById('weight-form') as HTMLFormElement;
      form.reset();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Weight Record</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Weight record added successfully!
        </div>
      )}
      
      <form id="weight-form" action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Weight
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              id="weight"
              name="weight"
              step="0.1"
              required
              className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="inline-flex">
              <button
                type="button"
                onClick={() => setUnit('kg')}
                className={`px-4 py-2 border border-l-0 ${
                  unit === 'kg' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                kg
              </button>
              <button
                type="button"
                onClick={() => setUnit('lbs')}
                className={`px-4 py-2 border border-l-0 rounded-r-md ${
                  unit === 'lbs' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                lbs
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Weight Record
        </button>
      </form>
    </div>
  );
} 