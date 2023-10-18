import { User } from '@prisma/client';
import { database } from '../config/database';

// Define a utility function to check if a user's password was changed after a certain date
export async function changedPasswordAfter(
  checkedUser: User,
  date: Date,
): Promise<boolean> {
  const user = await database.user.findUnique({
    where: { id: checkedUser.id },
    select: { lastPasswordChangeDate: true },
  });
  if (!user) {
    // Handle the case where the user is not found
    return false;
  }

  const lastPasswordChangeDate = user.lastPasswordChangeDate;
  if (!lastPasswordChangeDate) return true;

  return lastPasswordChangeDate > date;
}
