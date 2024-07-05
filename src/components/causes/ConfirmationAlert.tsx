import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { buttonVariants } from "../ui/button";

type TConfirmationAlertProps = {
  title: string;
  triggerText?: string;
  description?: string;
  Icon?: React.ElementType;
  onAction: () => void;
  actionText: string;
  isDestructive?: boolean;
  withCancel?: boolean;
  Footer?: React.ReactNode;
};

function ConfirmationAlert({
  title,
  triggerText,
  description,
  Icon,
  onAction,
  actionText,
  isDestructive = false,
  withCancel = false,
  Footer,
}: TConfirmationAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({
          variant: isDestructive ? "destructive" : "default",
          size: Icon ? "icon" : "default",
        })}
      >
        {triggerText ? triggerText : null}
        {Icon ? <Icon className="h-5 w-5" /> : null}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className={buttonVariants({
              variant: isDestructive ? "destructive" : "default",
            })}
            onClick={onAction}
          >
            {actionText}
          </AlertDialogAction>
          {Footer ? Footer : null}
          {withCancel ? <AlertDialogCancel>Cancel</AlertDialogCancel> : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmationAlert;
