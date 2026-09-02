import PageHeader from "@/components/PageHeader";
import StaffCard from "@/components/StaffCard";
import { getStaff, type StaffMember } from "@/lib/content";

export const metadata = { title: "Staff" };

function StaffSection({
  title,
  members,
}: {
  title: string;
  members: StaffMember[];
}) {
  if (members.length === 0) return null;
  return (
    <section aria-label={title} className="mt-10 first:mt-0">
      <h2 className="text-xl font-semibold tracking-tight text-penn-blue-600 dark:text-white">
        {title}
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member, i) => (
          <StaffCard key={`${member.name}-${i}`} member={member} />
        ))}
      </div>
    </section>
  );
}

export default function StaffPage() {
  const staff = getStaff();
  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <PageHeader
        eyebrow="Course Staff"
        title="Staff"
        description="The people running CIS 5200 this semester. Reach out on Ed first for course questions; email is best for personal matters."
      />
      <StaffSection title="Instructor" members={staff.instructor} />
      <StaffSection title="Head TAs" members={staff.headTas} />
      <StaffSection title="TAs" members={staff.tas} />
    </div>
  );
}
