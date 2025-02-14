import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef} from 'mdb-angular-ui-kit/modal';
import { HttpClient } from '@angular/common/http';
import { FriendsService } from '../../../services/user/friends.service';
import { UserService } from '../../../services/user/user.service';
import { PurchaseCouponService } from '../../../services/purchase-coupon/purchase-coupon.service';
import { PurchaseCoupon } from '../../../models/purchase-coupon';
import { ToastrService } from 'ngx-toastr';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { MessageService } from '../../../services/user/message.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-share-coupon-model',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './share-coupon-modal.component.html',
  styleUrl: './share-coupon-modal.component.css'
})
export class ShareCouponModalComponent {
  friends: any[] = [];
  coupons: any[] = [];
  friendIds: Set<number> = new Set();
  loggedInUserId: number | null = null;
  loggedInUserEmail: string | any = '';
  saleCouponId!: number;
  showModal: boolean = false;
  selectedFriendName: string = '';
  selectedUserId: number | null = null;

  @Input() coupon!: PurchaseCoupon;

  constructor(public modalRef: MdbModalRef<ShareCouponModalComponent>,
    private friendshipService: FriendsService,
    private userService: UserService,
    private purchaseCouponService: PurchaseCouponService ,
    private toastr: ToastrService,
    private websocketService: WebsocketService,
    private messageService: MessageService,
  ) {}

  close(): void {
    this.modalRef.close();
  }

  ngOnInit(): void {
    this.saleCouponId = this.coupon.saleCouponId;
    this.loadFriends();
    this.getLoggedInUserInfo();

  }

  loadFriends(): void {

    if (!this.loggedInUserId) {
      console.error('Logged-in user ID is missing. Cannot load friends.');
      return;
    }

    // Fetch the list of friends
    this.friendshipService.getFriends(this.loggedInUserId).subscribe({
      next: (data) => {
        this.friends = data;
        this.friendIds = new Set(data.map((friend) => friend.id));
        console.log('Friends loaded:', this.friends);

        // Fetch additional details for each friend (e.g., profile pictures)
        this.friends.forEach((friend) => {
          console.log('Fetching details for friend:', friend.friendId);
          this.friendshipService.getFriendDetails(friend.friendId).subscribe({
            next: (details) => {
              friend.profile = details.profile; // Assuming API provides 'profilePictureUrl'
            },
            error: (err) => {
              console.error(`Error fetching details for friend ${friend.id}:`, err);
              // Set a default image in case of error
              friend.profile = '/images/default-avatar.png';
            },
          });
        });
      },
      error: (err) => {
        console.error('Error fetching friends:', err);
      },
    });
  }


  sendCoupon(friendId: number): void {
    const friend = this.friends.find(f => f.id === friendId);
    if (friend) {
      this.selectedFriendName = friend.friendName;
      this.selectedUserId = friend.friendId;
      this.showModal = true;
    }
  }

  getLoggedInUserInfo(): void {
    this.userService.getUserInfo().subscribe({
      next: (user) => {
        this.loggedInUserEmail = user.email;
        this.loggedInUserId = user.id;

        console.log('Logged-in user info:', user);
        this.loadFriends();
      },
      error: (err) => {
        console.error('Error fetching logged-in user info:', err);
      },
    });
  }
  getFriendImageUrl(profile: string | null): string {
    return profile
      ? this.userService.getImageUrl(profile)
      : '/images/default-avatar.png';
  }
  confirmSendCoupon(): void {
    if (this.saleCouponId && this.selectedUserId) {
      this.purchaseCouponService.transferCoupon(this.saleCouponId, this.selectedUserId).subscribe({
        next: (message) => {
          const sentmessage = {
            senderId: this.loggedInUserId,
            receiverId: this.selectedUserId,
            content: "0| I just shared a coupon with you! 🎉",
          };
          this.messageService.sendMessage(sentmessage).subscribe({
            next: (response) => {
            },
            error: (err) => console.error('Error sending message:', err),
          });
          console.log(message);
          this.toastr.success(`Coupon successfully transferred to ${this.selectedFriendName}!`);

          this.modalRef.close(message);  // Close the modal after success
        },
        error: (err) => {
          console.error('Error transferring coupon:', err);
          alert('Failed to transfer coupon.');
        }
      });
    } else {
      alert('No coupon selected for transfer or invalid user!');
    }

    // Close the modal after confirming the transfer
    this.showModal = false;
  }
  cancelSendCoupon(): void {
    this.showModal = false; // Close the modal if canceled
  }
}
