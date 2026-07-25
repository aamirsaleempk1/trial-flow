export async function executeQuery(text: string) {
  return {
    rows: [
      { id: 1, name: 'Patient 1', age: 55, sex: 'Male', language: 'en' },
      { id: 2, name: 'Patient 2', age: 62, sex: 'Female', language: 'es' },
      { id: 3, name: 'Patient 3', age: 48, sex: 'Male', language: 'en' },
    ],
    rowCount: 3,
  };
}
