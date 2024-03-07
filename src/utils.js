import { useState, useEffect } from "react";

export function useNestedLocalStorage({
  localStorageKey,
  objectKey,
  defaultValue,
  replacer,
}) {
  const [val, setVal] = useState(
    JSON.parse(localStorage.getItem(localStorageKey))?.[objectKey] ??
      defaultValue
  );

  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem(localStorageKey));

    localStorage.setItem(
      localStorageKey,
      JSON.stringify(
        {
          ...prev,
          [objectKey]: val,
        },
        replacer
      )
    );
  }, [val]);

  return [val, setVal];
}
