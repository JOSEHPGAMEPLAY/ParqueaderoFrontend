import { DashboardHeaderProps } from "@/types/dashboard";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    onCreateRegister,
    isLoading
}) => {
    return(
        <>
            <h1 className="my-5 font-medium text-3xl">Registro de Parqueadero</h1>
            <div className="flex justify-center mb-5">
                <Button color="primary" onPress={onCreateRegister}>
                    {isLoading ? <Spinner color="default" /> : "Agregar Registro"}
                </Button>
            </div>
        </>
    )
}