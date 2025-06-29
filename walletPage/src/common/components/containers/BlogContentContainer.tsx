type Props = {
  children: React.ReactNode;
};

export default function BlogContentContainer({ children }: Props) {
  return (
    <article className="prose prose-invert relative mx-auto max-w-2xl text-slate-400 lg:prose-lg">
      {children}
    </article>
  );
}
