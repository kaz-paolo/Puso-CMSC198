// url link handling resourceslist.jsx

export function useExternalLink() {
  const openLink = (url) => {
    if (!url) return;
    let fullUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      fullUrl = `https://${url}`;
    }
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return { openLink };
}
