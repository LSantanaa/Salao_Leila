interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function Button({ text, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full p-2 bg-pink-950 text-white rounded-lg hover:bg-pink-800 transition-all"
    >
      {text}
    </button>
  );
}
