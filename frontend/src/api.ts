const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.100.76:5031/api';

export interface Member {
  memberID?: number;
  fName: string;
  lName: string;
  nickName?: string;
  fullName?: string;
  email: string;
  digitalID?: string;
  company: string;
  phoneNumbers?: string[];
}

export interface Workspace {
  workspaceID?: number;
  type: string;
  price: number;
  capacity: number;
  hubID: number;
  hubName?: string;
}

export interface Reservation {
  reservationID?: number;
  memberID: number;
  workspaceID: number;
  startDate: string;
  endDate: string;
  status: string;
  memberName?: string;
  workspaceType?: string;
}

export interface Equipment {
  equipmentID?: number;
  name: string;
  type: string;
}

export interface Hub {
  hubID?: number;
  name: string;
  street?: string;
  city?: string;
  district?: string;
  building?: string;
  layout?: string;
}

export interface MemberPhone {
  phoneID?: number;
  memberID: number;
  phoneNumber: string;
  memberName?: string;
}

export interface ReservationEquipment {
  reservationID: number;
  equipmentID: number;
  hoursUsed: number;
  equipmentName?: string;
  equipmentType?: string;
  memberName?: string;
  workspaceType?: string;
}

export interface EquipmentPerHub {
  hubName: string;
  equipmentName: string;
  equipmentType: string;
  totalHours: number;
}

export interface MemberHours {
  memberID: number;
  fName: string;
  lName: string;
  email: string;
  company: string;
  totalHours: number;
}

export const api = {
  members: {
    getAll: () => fetch(`${API_BASE_URL}/members`).then(res => res.json()),
    add: (data: Member) => fetch(`${API_BASE_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    delete: (id: number) => fetch(`${API_BASE_URL}/members/${id}`, { method: 'DELETE' })
  },
  workspaces: {
    getAll: () => fetch(`${API_BASE_URL}/workspaces`).then(res => res.json()),
    getHubs: () => fetch(`${API_BASE_URL}/workspaces/hubs`).then(res => res.json()),
    add: (data: Workspace) => fetch(`${API_BASE_URL}/workspaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    delete: (id: number) => fetch(`${API_BASE_URL}/workspaces/${id}`, { method: 'DELETE' })
  },
  reservations: {
    getAll: () => fetch(`${API_BASE_URL}/reservations`).then(res => res.json()),
    add: (data: Reservation) => fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    delete: (id: number) => fetch(`${API_BASE_URL}/reservations/${id}`, { method: 'DELETE' })
  },
  equipment: {
    getAll: () => fetch(`${API_BASE_URL}/equipment`).then(res => res.json()),
    add: (data: Equipment) => fetch(`${API_BASE_URL}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    delete: (id: number) => fetch(`${API_BASE_URL}/equipment/${id}`, { method: 'DELETE' })
  },
 report: {
  getDashboard: (
    startDate?: string,
    endDate?: string
  ) => {
    let url =
      `${API_BASE_URL}/report/dashboard`;

    const params =
      new URLSearchParams();

    if (startDate) {
      params.append(
        "startDate",
        startDate
      );
    }

    if (endDate) {
      params.append(
        "endDate",
        endDate
      );
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return fetch(url)
      .then(res => res.json());
  }
},
  hubs: {
    getAll: () => fetch(`${API_BASE_URL}/hubs`).then(res => res.json()),
    add: (data: Hub) => fetch(`${API_BASE_URL}/hubs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    update: (id: number, data: Hub) => fetch(`${API_BASE_URL}/hubs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    delete: (id: number) => fetch(`${API_BASE_URL}/hubs/${id}`, { method: 'DELETE' })
  }
};
