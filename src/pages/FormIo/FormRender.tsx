import { useGetDynamicForm2 } from "@/api/service";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Form } from "@formio/react";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router";

const FormRender = () => {
  const { formId } = useParams();

  const { data } = useGetDynamicForm2(formId);

  if (!data?.components) return <Loader2 className="animate-spin" />;
  return (
    <Card>
      <CardTitle>Basic form rendering</CardTitle>
      <CardContent>
        <Form
          src={{ components: data?.components || [] }}
          onSubmit={(values) => console.log(values)}
        />
      </CardContent>
    </Card>
  );
};

export default FormRender;
