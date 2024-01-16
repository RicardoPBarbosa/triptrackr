import { PaymentMethodType } from "@/@types";
import { paymentMethodsIcons } from "@/constants";

export default function PaymentMethodSelect({
  defaultValue = PaymentMethodType.CARD,
}: {
  defaultValue?: PaymentMethodType;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-display font-bold">Payment method</label>
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {Object.entries(paymentMethodsIcons).map(([method, icon]) => (
          <div key={method} className="radio">
            <input
              hidden
              type="radio"
              name="paymentMethod"
              id={method}
              value={method}
              readOnly
              defaultChecked={defaultValue === method}
              className="peer"
            />
            <label
              htmlFor={method}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-background-paper px-3 py-2 tracking-wide text-gray-200 transition-colors hover:bg-background-light peer-checked:bg-tertiary peer-checked:text-background"
            >
              {icon({ size: "22" })}
              <span className="capitalize">{method}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
