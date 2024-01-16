import Input from "@/components/Input";

type Props = {
  name: string;
  setName: (name: string) => void;
};

export default function EditName({ name, setName }: Props) {
  return (
    <Input
      placeholder="Give the trip a name"
      autoFocus
      color="primary"
      value={name}
      required
      onChange={(e) => setName(e.target.value)}
    />
  );
}
