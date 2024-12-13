import TicketList from "@/components/entities/TicketList";
import NewDialogButton from "@/components/NewDialogButton";

const TicketPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl text-zinc-950">Support Tickets</h1>

        <NewDialogButton url={"/dashboard/ticket/create"} />
      </header>

      <TicketList />
    </div>
  );
};

export default TicketPage;
