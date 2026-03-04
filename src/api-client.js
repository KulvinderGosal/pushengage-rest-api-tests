import axios from 'axios';

export class PushEngageAPIClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.PUSHENGAGE_API_KEY;
    this.siteId = config.siteId || process.env.PUSHENGAGE_SITE_ID;
    this.baseURL = config.baseURL || process.env.PUSHENGAGE_BASE_URL || 'https://api.pushengage.com/apiv1';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    this.client.interceptors.request.use(
      (config) => {
        if (this.apiKey) {
          config.headers['api-key'] = this.apiKey;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          error.message = `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper to convert object to form data
  _toFormData(data) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return formData.toString();
  }

  // Notifications API
  async sendNotification(notificationData) {
    // Map common field names to PushEngage API field names
    const params = {
      notification_title: notificationData.title || notificationData.notification_title,
      notification_message: notificationData.message || notificationData.notification_message,
      notification_url: notificationData.url || notificationData.notification_url,
      notification_type: notificationData.notification_type || 'draft', // Default to draft for safety
    };
    
    // Add optional parameters if provided
    if (notificationData.image_url || notificationData.image) {
      params.image_url = notificationData.image_url || notificationData.image;
    }
    if (notificationData.big_image_url) {
      params.big_image_url = notificationData.big_image_url;
    }
    if (notificationData.notification_expiry) {
      params.notification_expiry = notificationData.notification_expiry;
    }
    if (notificationData.valid_from_utc) {
      params.valid_from_utc = notificationData.valid_from_utc;
    }
    if (notificationData.require_interaction !== undefined) {
      params.require_interaction = notificationData.require_interaction ? '1' : '0';
    }
    if (notificationData.utm_source) {
      params.utm_source = notificationData.utm_source;
    }
    if (notificationData.utm_medium) {
      params.utm_medium = notificationData.utm_medium;
    }
    if (notificationData.utm_campaign) {
      params.utm_campaign = notificationData.utm_campaign;
    }
    
    // Handle multi-element/action buttons
    if (notificationData.actions && Array.isArray(notificationData.actions)) {
      notificationData.actions.forEach((action, index) => {
        const num = index + 1;
        if (num <= 2) { // PushEngage supports max 2 action buttons
          params[`multi_element_title${num}`] = action.title;
          params[`multi_element_url${num}`] = action.url;
          if (action.image) {
            params[`multi_element_image${num}`] = action.image;
          }
        }
      });
    }
    
    // Handle targeting
    if (notificationData.include_segments) {
      params.include_segments = notificationData.include_segments;
    }
    if (notificationData.include_and_segments) {
      params.include_and_segments = notificationData.include_and_segments;
    }
    if (notificationData.exclude_segments) {
      params.exclude_segments = notificationData.exclude_segments;
    }
    if (notificationData.subscriber_hash) {
      params.subscriber_hash = notificationData.subscriber_hash;
    }
    if (notificationData.profile_id) {
      params.profile_id = notificationData.profile_id;
    }
    
    const response = await this.client.post(`/notifications`, this._toFormData(params));
    return response.data;
  }

  async getNotifications(params = {}) {
    const response = await this.client.get(`/notifications`, { params });
    return response.data;
  }

  async getSentNotifications(params = {}) {
    return this.getNotifications({ ...params, status: 'sent' });
  }

  async getScheduledNotifications(params = {}) {
    return this.getNotifications({ ...params, notification_type: 'later' });
  }

  async getDraftNotifications(params = {}) {
    return this.getNotifications({ ...params, notification_type: 'draft' });
  }

  async getNotificationById(notificationId) {
    const response = await this.client.get(`/notifications/${notificationId}`);
    return response.data;
  }

  async deleteNotification(notificationId) {
    const response = await this.client.delete(`/notifications/${notificationId}`);
    return response.data;
  }

  // Subscribers API
  async getSubscribers(params = {}) {
    const response = await this.client.get(`/subscribers`, { params });
    return response.data;
  }

  async getSubscriberById(subscriberId) {
    const response = await this.client.get(`/subscribers/${subscriberId}`);
    return response.data;
  }

  async addSubscriber(subscriberData) {
    const response = await this.client.post(`/subscribers`, this._toFormData(subscriberData));
    return response.data;
  }

  async updateSubscriber(subscriberId, updateData) {
    const response = await this.client.put(`/subscribers/${subscriberId}`, this._toFormData(updateData));
    return response.data;
  }

  async deleteSubscriber(subscriberId) {
    const response = await this.client.delete(`/subscribers/${subscriberId}`);
    return response.data;
  }

  // Segments API
  async getSegments(params = {}) {
    const response = await this.client.get(`/segments`, { params });
    return response.data;
  }

  async getSegmentById(segmentId) {
    const response = await this.client.get(`/segments/${segmentId}`);
    return response.data;
  }

  async createSegment(segmentData) {
    const response = await this.client.post(`/segments`, this._toFormData(segmentData));
    return response.data;
  }

  async deleteSegment(segmentId) {
    const response = await this.client.delete(`/segments/${segmentId}`);
    return response.data;
  }

  // Campaigns / Drip Autoresponders API
  async getCampaigns(params = {}) {
    const response = await this.client.get(`/campaigns`, { params });
    return response.data;
  }

  async getCampaignById(campaignId) {
    const response = await this.client.get(`/campaigns/${campaignId}`);
    return response.data;
  }

  async createCampaign(campaignData) {
    const response = await this.client.post(`/campaigns`, this._toFormData(campaignData));
    return response.data;
  }

  async updateCampaign(campaignId, updateData) {
    const response = await this.client.put(`/campaigns/${campaignId}`, this._toFormData(updateData));
    return response.data;
  }

  async deleteCampaign(campaignId) {
    const response = await this.client.delete(`/campaigns/${campaignId}`);
    return response.data;
  }

  // Analytics / Stats API
  async getSiteStats(params = {}) {
    const response = await this.client.get(`/stats`, { params });
    return response.data;
  }

  async getSiteAttributes() {
    const response = await this.client.get(`/attributes`);
    return response.data;
  }

  // Subscriber Attributes API
  async getSubscriberAttributes(subscriberId) {
    const response = await this.client.get(`/subscribers/${subscriberId}/attributes`);
    return response.data;
  }

  async updateSubscriberAttributes(subscriberId, attributes) {
    const response = await this.client.put(`/subscribers/${subscriberId}/attributes`, this._toFormData(attributes));
    return response.data;
  }
}
