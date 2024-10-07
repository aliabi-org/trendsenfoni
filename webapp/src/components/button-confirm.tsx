import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
} from "@/components/ui/alert-dialog"

interface Props {
  className?: string
  text?: string
  description?: any
  children?: any
  onOk?: () => void
  onCancel?: () => void
}
// export function ButtonDelete({
//   className = "",
//   text = "?",
//   description = undefined,
//   children = undefined,
//   onOk=undefined,
//   onCancel=undefined,
// }: Props) {
//   return (
//     <AlertDialog>
//       <AlertDialogTrigger>
//         <Button variant={'destructive'} ><i className="fa-solid fa-trash-alt text-xl"></i></Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>{text}</AlertDialogTitle>
//           {description && <AlertDialogDescription>
//             {description}
//           </AlertDialogDescription>}
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel onClick={() => onCancel && onCancel()}>Cancel</AlertDialogCancel>
//           <AlertDialogAction onClick={() => onOk && onOk()}>Confirm</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>

//   )
// }

export function ButtonConfirm({
  className = "",
  text = "?",
  description = undefined,
  children = undefined,
  onOk = undefined,
  onCancel = undefined,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{text}</AlertDialogTitle>
          {description && <AlertDialogDescription>
            {description}
          </AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onCancel && onCancel()}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onOk && onOk()}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}