type ProducedAtProps = {
  strategy: string;
  time: string;
};

export default function ProducedAt({ strategy, time }: ProducedAtProps) {
  return (
    <p className="produced-at">
      Produced at: <time dateTime={time}>{time}</time> ({strategy})
    </p>
  );
}
