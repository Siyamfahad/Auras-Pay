export type StatNumbersType = {
  stats?: SingleStatNumberType[];
};

export default function StatNumbers({ stats }: StatNumbersType) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-y-2 ">
      {stats?.map((stat, index) => (
        <StatNumber {...stat} key={index} />
      ))}
    </div>
  );
}

export type SingleStatNumberType = {
  number?: string | number;
  label?: string;
  suffix?: string;
};

const StatNumber = ({ number, label, suffix }: SingleStatNumberType) => (
  <div className=" px-10 py-4 sm:px-20 ">
    <p className="mb-0 whitespace-nowrap  bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-black text-transparent  sm:text-6xl ">
      {number} {suffix}
    </p>
    <p className="mt-2 text-center text-lg leading-relaxed tracking-wide text-gray-400">
      {label}
    </p>
  </div>
);
