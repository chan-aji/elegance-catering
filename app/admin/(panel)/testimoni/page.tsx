import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialManager } from "@/components/admin/testimonial-manager";
import { getTestimonials } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminTestimoniPage() {
  const testimonials = await getTestimonials();

  return (
    <AdminShell title="Testimoni" subtitle="CRUD testimoni pelanggan yang tampil pada website customer.">
      <TestimonialManager testimonials={testimonials} />
    </AdminShell>
  );
}
