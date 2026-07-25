'use client';

import { motion } from 'framer-motion';
import { Users, Clock, Database, AlertCircle } from 'lucide-react';

interface ResultsProps {
  results: any;
}

export default function ResultsPanel({ results }: ResultsProps) {
  if (!results) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>No results to display</p>
          <p className="text-sm">Run a trial to see eligible patients</p>
        </div>
      </div>
    );
  }

  const { patients = [], count = 0, executionTime = '0ms' } = results;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div>
            <p className="text-sm text-blue-600 font-medium">Eligible Patients</p>
            <p className="text-3xl font-bold text-blue-700">{count}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div>
            <p className="text-sm text-green-600 font-medium">Execution Time</p>
            <p className="text-2xl font-bold text-green-700">{executionTime}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div>
            <p className="text-sm text-purple-600 font-medium">Data Sources</p>
            <p className="text-2xl font-bold text-purple-700">4</p>
          </div>
        </div>
      </div>

      {patients.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">Patient List</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Sex</th>
                  <th className="px-4 py-2">Language</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 10).map((patient: any, idx: number) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-xs">{patient.id || 'N/A'}</td>
                    <td className="px-4 py-2">{patient.name || 'N/A'}</td>
                    <td className="px-4 py-2">{patient.age || 'N/A'}</td>
                    <td className="px-4 py-2">{patient.sex || 'N/A'}</td>
                    <td className="px-4 py-2">{patient.language || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No patients match the criteria</p>
        </div>
      )}
    </div>
  );
}
