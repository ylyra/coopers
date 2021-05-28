import { Fragment, useEffect, useRef } from "react";
import { useField } from "@unform/core";

type Props = {
  name: string;
  label?: string;
};
type InputProps = JSX.IntrinsicElements["input"] & Props;

export default function Input({ name, label, ...rest }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => ref.current.value,
      setValue: (ref, value) => (ref.current.value = value),
      clearValue: (ref) => (ref.current.value = ""),
    });
  }, [fieldName, registerField]);

  return (
    <Fragment>
      {label && <label htmlFor={fieldName}>{label}</label>}
      <input
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        {...rest}
      />
    </Fragment>
  );
}
