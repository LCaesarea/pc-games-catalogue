type PageHeaderProps = {
  title: string;
  intro: string;
};

export default function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      <p>{intro}</p>
    </header>
  );
}
