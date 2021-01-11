import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Feed } from './feed';
import Pusher from 'pusher-js';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private subject: Subject<Feed> = new Subject<Feed>();

      private pusherClient: Pusher;
      private appKey = environment.PUSHER_APP_KEY;
      private clusterKey = environment.PUSHER_APP_CLUSTER;

      constructor() {
        this.pusherClient = new Pusher(this.appKey, { cluster: this.clusterKey });

        const channel = this.pusherClient.subscribe('realtime-feeds');

        channel.bind(
          'posts',
          (data: { title: string; body: string; time: string }) => {
            this.subject.next(new Feed(data.title, data.body, new Date(data.time)));
          }
        );
      }

      getFeedItems(): Observable<Feed> {
        return this.subject.asObservable();
      }
}
