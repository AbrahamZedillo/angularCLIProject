import { Component } from '@angular/core';
import axios from 'axios';
import  { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

@Component({
  selector: 'app-body',
  imports: [ FormsModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})

export class BodyComponent {
  dataUser : User[];
  dataPost: Post[];
  dataComment: Comment[];
  filteredData: User[];
  paginatedData: User[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalPagesArray: number[];
  selectedUser: User | null;
  mapUrl: SafeResourceUrl;
  showPosts: boolean;
  selectedPost: Post | null;

  constructor(private sanitizer: DomSanitizer) {
    this.dataUser = [];
    this.dataPost = [];
    this.dataComment = [];
    this.filteredData = [];
    this.paginatedData = [];
    this.searchTerm = '';
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.totalPages = 0;
    this.totalPagesArray = [];
    this.selectedUser = null;
    this.mapUrl = '';
    this.showPosts = false;
    this.selectedPost = null;
  }

  ngOnInit(): void {
    this.getDataUsers();
  }

  ngOnDestroy(): void {
    
  }

  private async getDataUsers(): Promise<void> {
    try {
      let response = await axios.get('https://jsonplaceholder.typicode.com/users');
      this.dataUser = response.data;
      this.filteredData = this.dataUser;
      this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.paginateData();
    } catch (error) {
      console.error(error);
    }
  }

  async getDataPosts(userId: number): Promise<void> {
    try {
      let response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
      this.dataPost = response.data;
      this.showPosts = true;
    } catch (error) {
      console.error(error);
    }
  }

  async getDataComments(postId: number): Promise<void> {
    try {
      let response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
      this.dataComment = response.data;
      this.selectedPost = this.dataPost.find(post => post.id === postId) || null;
      const modalElement = document.getElementById('commentsModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } catch (error) {
      console.error(error);
    }
  }

  filterData(): void {
    this.filteredData = this.dataUser.filter(user =>
      user.id.toString().includes(this.searchTerm) ||
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.currentPage = 1;
    this.paginateData();
  }

  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginateData();
  }

  showMoreInfo(user: User): void {
    this.selectedUser = user;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(user.address.geo.lng) - 0.01},${parseFloat(user.address.geo.lat) - 0.01},${parseFloat(user.address.geo.lng) + 0.01},${parseFloat(user.address.geo.lat) + 0.01}&layer=mapnik&marker=${user.address.geo.lat},${user.address.geo.lng}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    const modalElement = document.getElementById('infoModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
