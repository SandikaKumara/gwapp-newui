import TicketList from "@/components/entities/TicketList";
import NewDialogButton from "@/components/NewDialogButton";

const TicketPage = () => {
  return (
    <div className="flex flex-col gap-4 px-4 py-2 bg-white rounded shadow-md">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Support Tickets</h1>

        <NewDialogButton url={"/dashboard/ticket/create"} />
      </header>

      <TicketList />
    </div>
  );
};

export default TicketPage;
