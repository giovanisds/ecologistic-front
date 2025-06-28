import { useCallback } from "react";

const useFieldProps = ({ errors, register }) => {
  const getFieldProps = useCallback(
    (field, validation) => {
      return {
        error: !!errors?.[field],
        helperText: errors?.[field]?.message,
        ...register(field, validation),
      };
    },
    [errors, register]
  );

  return { getFieldProps };
};

export default useFieldProps;
