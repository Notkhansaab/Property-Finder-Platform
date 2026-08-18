import {
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiClock,
  FiFilter,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const transactions = [
  {
    date: "Oct 15, 2023",
    property: "Modern Urban Loft",
    id: "#BK-9821",
    amount: "$450.00",
    fee: "-$45.00",
    payout: "$405.00",
    status: "Paid",
  },
  {
    date: "Oct 25, 2023",
    property: "Sunny Beach House",
    id: "#BK-7742",
    amount: "$1200.00",
    fee: "-$120.00",
    payout: "$1080.00",
    status: "Pending",
  },
  {
    date: "Nov 05, 2023",
    property: "Mountain Retreat",
    id: "#BK-5510",
    amount: "$800.00",
    fee: "-$80.00",
    payout: "$720.00",
    status: "Paid",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-gray-100 text-gray-700",
    Processing: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default function HostEarnings() {
  return (
    <div className="min-h-screen bg-[#faf8ff] p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-semibold tracking-tight text-[#191b23]">
          Earnings Overview
        </h1>

        <p className="mt-2 text-[16px] text-[#737686]">
          Track your revenue, platform fees, and payouts.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Earnings */}

        <div className="bg-white rounded-2xl border border-[#c3c5d7]/50 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#737686]">
              Total Earnings
            </p>

            <div className="w-10 h-10 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#003fb1]">
              <FiDollarSign />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-[#191b23]">$12,450</h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-[#006a61]">
            <FiTrendingUp />

            <span>+14.5% from last month</span>
          </div>
        </div>

        {/* Fees */}

        <div className="bg-white rounded-2xl border border-[#c3c5d7]/50 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#737686]">
              Platform Fees
            </p>

            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <FiCreditCard />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#191b23]">$1,245</h2>

          <p className="mt-3 text-sm text-[#737686]">Deducted automatically</p>
        </div>

        {/* Main Blue Card */}

        <div className="relative overflow-hidden bg-[#003fb1] rounded-2xl p-6 text-white shadow-lg">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px,white 1px,transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />

          <div className="relative">
            <div className="flex justify-between mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Net Payouts
              </p>

              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FiDollarSign />
              </div>
            </div>

            <h2 className="text-4xl font-bold">$11,205</h2>

            <p className="mt-3 text-sm opacity-80">Available for transfer</p>
          </div>
        </div>

        {/* Pending */}

        <div className="bg-white rounded-2xl border border-[#c3c5d7]/50 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#737686]">
              Pending Balance
            </p>

            <div className="w-10 h-10 rounded-full bg-[#86f2e4] flex items-center justify-center text-[#006a61]">
              <FiClock />
            </div>
          </div>

          <h2 className="text-3xl font-bold">$850</h2>

          <p className="mt-3 text-sm text-[#737686]">Clearing in 2-3 days</p>
        </div>
      </div>

      {/* Transactions */}

      <div className="bg-white rounded-2xl border border-[#c3c5d7]/50 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#f3f3fe] border-b border-[#c3c5d7]/40">
          <h2 className="text-xl font-semibold text-[#191b23]">
            Recent Transactions
          </h2>

          <div className="flex gap-3">
            <button className="h-10 px-4 rounded-xl border border-[#c3c5d7] bg-white flex items-center gap-2 text-sm hover:bg-[#faf8ff] transition">
              <FiFilter />
              Filter
            </button>

            <button className="h-10 px-4 rounded-xl bg-[#003fb1] text-white flex items-center gap-2 text-sm hover:bg-[#00369a] transition">
              <FiDownload />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-white">
                {[
                  "Date",
                  "Property",
                  "Booking ID",
                  "Amount",
                  "Fee",
                  "Net Payout",
                  "Status",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left text-xs uppercase tracking-wider text-[#737686]"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {transactions.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#c3c5d7]/30 hover:bg-[#f8f8ff] transition"
                >
                  <td className="px-6 py-5 text-sm">{item.date}</td>

                  <td className="px-6 py-5 font-medium">{item.property}</td>

                  <td className="px-6 py-5 text-[#737686]">{item.id}</td>

                  <td className="px-6 py-5 text-right">{item.amount}</td>

                  <td className="px-6 py-5 text-right text-red-600">
                    {item.fee}
                  </td>

                  <td className="px-6 py-5 text-right font-semibold">
                    {item.payout}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
