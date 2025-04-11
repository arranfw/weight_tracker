import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getWeightRecords } from "@/actions/weight";
import WeightForm from "@/components/WeightForm";
import WeightChart from "@/components/WeightChart";
import WeightTable from "@/components/WeightTable";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const weightRecords = await getWeightRecords();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Weight Tracker Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WeightForm />
        </div>

        <div className="lg:col-span-2">
          <WeightChart weightRecords={weightRecords} />
        </div>
      </div>

      <div className="mt-8">
        <WeightTable weightRecords={weightRecords} />
      </div>
    </div>
  );
}
