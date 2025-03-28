import { Button } from "@/components/ui/button";

const OrderStatusFilter = ({ statusActive, setStatusActive }) => {
  const buttons = [
    { label: "To Pay", value: "to-pay" },
    { label: "To Receive", value: "to-deliver" },
    { label: "Completed", value: "completed" },
  ];

  const handleStatusButtonClick = (e) => {
    const status = e.target.value;
    setStatusActive(status);
  };

  return (
    <div className="flex justify-center my-3 gap-3">
      {buttons.map((button) => {
        return (
          <Button
            key={button.label}
            className={`w-full active:bg-blue-500 ${
              statusActive === button.value ? "!bg-blue-500" : "bg-blue-200"
            }`}
            style={{ transition: "background-color 0.3s" }}
            onClick={handleStatusButtonClick}
            value={button.value}
          >
            {button.label}
          </Button>
        );
      })}
    </div>
  );
};

export default OrderStatusFilter;
