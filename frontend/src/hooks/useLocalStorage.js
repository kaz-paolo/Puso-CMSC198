// in themeprovider.jsx
const [colorScheme, setColorScheme] = useState(() => {
  return localStorage.getItem("colorScheme") || "light";
});

useEffect(() => {
  localStorage.setItem("colorScheme", colorScheme);
}, [colorScheme]);
