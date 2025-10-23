"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile, useDeleteAccount } from "@/hooks/use-profile";
import { UpdateProfileInputSchema } from "@workspace/types";
import type { UpdateProfileInput, AuthUser } from "@workspace/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Trash2 } from "lucide-react";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser;
}

export function EditProfileModal({
  open,
  onOpenChange,
  user,
}: EditProfileModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();

  const isDemoAccount = user.email === "demo@orion-kit.dev";

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileInputSchema),
    defaultValues: {
      name: user.name || "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      await updateProfile.mutateAsync(data);
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount.mutateAsync();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              {isDemoAccount
                ? "Demo account - limited editing available."
                : "Update your profile information or delete your account."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        disabled={isDemoAccount}
                      />
                    </FormControl>
                    {isDemoAccount && (
                      <p className="text-xs text-muted-foreground">
                        You can't edit the demo account name
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                {isDemoAccount ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trash2 className="h-4 w-4" />
                    <span>You can't delete the demo account</span>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProfile.isPending || isDemoAccount}
                  >
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteAccount.isPending}
            >
              {deleteAccount.isPending ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
