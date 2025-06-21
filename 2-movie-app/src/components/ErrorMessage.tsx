interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => {
  return (
    <div className="m-auto mt-10">
      <p className="text-red-500 font-bold">{errorMessage}</p>
    </div>
  );
};

export default ErrorMessage;
