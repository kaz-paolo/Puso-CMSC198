//  in VolunteerForm.jsx and FormSectionPage.jsx
export function useFormPersistence(key, initialState) {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(form));
  }, [key, form]);

  const updateField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  return { form, setForm, updateField };
}
