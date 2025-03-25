import { Button } from "@/components/ui/button";

const OrderStatusFilter = ({ statusActive, setStatusActive }) => {
  const buttons = [{ label: "Success" }, { label: "Fail" }];

  const handleStatusButtonClick = (e) => {
    const status = e.target.innerText.toLowerCase();

    setStatusActive(status);
  };

  return (
    <div className="flex justify-center my-3 gap-3">
      {buttons.map((button) => {
        return (
          <Button
            key={button.label}
            className={`w-full active:bg-blue-500 ${
              statusActive === button.label.toLowerCase()
                ? "!bg-blue-500"
                : "bg-blue-200"
            }`}
            style={{ transition: "background-color 0.3s" }}
            onClick={handleStatusButtonClick}
          >
            {button.label}
          </Button>
        );
      })}
    </div>
  );
};

export default OrderStatusFilter;
