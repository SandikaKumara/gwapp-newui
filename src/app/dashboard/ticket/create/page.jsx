import BackButton from "@/components/BackButton";
import TicketForm from "@/components/form/ticket/TicketForm";

const createTicketPage = () => {
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl text-zinc-950">Create Ticket</h1>
        <BackButton url={"/dashboard/ticket"} />
      </header>

      <TicketForm />
    </div>
  );
};

export default createTicketPage;
