// src/components/SubjectGradeSelector.tsx
import React from 'react';

interface Props {
  subject: string;
  setSubject: (s: string) => void;
  grade: string;
  setGrade: (g: string) => void;
  subjects: string[];
  grades: string[];
}

export default function SubjectGradeSelector({ subject, setSubject, grade, setGrade, subjects, grades }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          Subject
          <span className="text-xs text-gray-400" title="Not sure? Pick any subject to get started. You can change it later!">(?)</span>
        </label>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        >
          <option value="">Not sure? Let us suggest!</option>
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          Grade
          <span className="text-xs text-gray-400" title="Not sure? Pick the closest grade. You can always adjust later!">(?)</span>
        </label>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={grade}
          onChange={e => setGrade(e.target.value)}
        >
          <option value="">Not sure? Let us suggest!</option>
          {grades.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

SubjectGradeSelector.propTypes = {
  subject: require('prop-types').string.isRequired,
  setSubject: require('prop-types').func.isRequired,
  grade: require('prop-types').string.isRequired,
  setGrade: require('prop-types').func.isRequired,
  subjects: require('prop-types').arrayOf(require('prop-types').string).isRequired,
  grades: require('prop-types').arrayOf(require('prop-types').string).isRequired,
};
