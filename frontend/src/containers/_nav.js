import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faCartShopping,
  faList,
  faList12,
  faUsers,
  faHouse,
  faSitemap,
  faBoxes,
  faUser,
  faDatabase,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";

export const nav_admin = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <FontAwesomeIcon icon={faChartBar} className="mr-4 ml-2" />,
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Transaksi",
    route: "/transaksi",
    icon: <FontAwesomeIcon icon={faCartShopping} className="mr-4 ml-2" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Tambah",
        to: "/transaksi/tambah",
      },
      {
        _tag: "CSidebarNavItem",
        name: "History",
        to: "/transaksi/history",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Stok",
    route: "/stok",
    icon: <FontAwesomeIcon icon={faSitemap} className="mr-4 ml-2" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Masuk",
        to: "/stok/masuk",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Keluar",
        to: "/stok/keluar",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Opname",
        to: "/stok/opname",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Master Data",
    route: "/penjualan",
    icon: <FontAwesomeIcon icon={faDatabase} className="mr-4 ml-2" />,
    _children: [
      {
        _tag: "CSidebarNavDropdown",
        name: "Produk",
        route: "/produk",
        icon: <FontAwesomeIcon icon={faList} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/produk/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/produk/tambah",
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Kategori",
        route: "/kategori",
        icon: <FontAwesomeIcon icon={faList12} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/kategori/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/kategori/tambah",
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Pelanggan",
        route: "/pelanggan",
        icon: <FontAwesomeIcon icon={faUsers} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/pelanggan/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/pelanggan/tambah",
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Supplier",
        route: "/supplier",
        icon: <FontAwesomeIcon icon={faHouse} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/supplier/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/supplier/tambah",
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Unit",
        route: "/unit",
        icon: <FontAwesomeIcon icon={faBoxes} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/unit/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/unit/tambah",
          },
        ],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Users",
        to: "/users",
        icon: <FontAwesomeIcon icon={faUser} className="mr-4" />,
      },
    ],
  },
];

export const nav_user = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <FontAwesomeIcon icon={faChartBar} className="mr-4 ml-2" />,
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Transaksi",
    route: "/transaksi",
    icon: <FontAwesomeIcon icon={faCartShopping} className="mr-4 ml-2" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Tambah",
        to: "/transaksi/tambah",
      },
      {
        _tag: "CSidebarNavItem",
        name: "History",
        to: "/transaksi/history",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Stok",
    route: "/stok",
    icon: <FontAwesomeIcon icon={faSitemap} className="mr-4 ml-2" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Masuk",
        to: "/stok/masuk",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Keluar",
        to: "/stok/keluar",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Opname",
        to: "/stok/opname",
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Master Data",
    route: "/penjualan",
    icon: <FontAwesomeIcon icon={faDatabase} className="mr-4 ml-2" />,
    _children: [
      {
        _tag: "CSidebarNavDropdown",
        name: "Produk",
        route: "/produk",
        icon: <FontAwesomeIcon icon={faList} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/produk/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/produk/tambah",
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Kategori",
        route: "/kategori",
        icon: <FontAwesomeIcon icon={faList12} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/kategori/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/kategori/tambah",
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Pelanggan",
        route: "/pelanggan",
        icon: <FontAwesomeIcon icon={faUsers} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/pelanggan/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/pelanggan/tambah",
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Supplier",
        route: "/supplier",
        icon: <FontAwesomeIcon icon={faHouse} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/supplier/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/supplier/tambah",
          },
        ],
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Unit",
        route: "/unit",
        icon: <FontAwesomeIcon icon={faBoxes} className="mr-4" />,
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "List",
            to: "/unit/list",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Tambah",
            to: "/unit/tambah",
          },
        ],
      },
    ],
  },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Produk",
  //   route: "/produk",
  //   icon: <FontAwesomeIcon icon={faList} className="mr-4 ml-2" />,
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "List",
  //       to: "/produk/list",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Tambah",
  //       to: "/produk/tambah",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Stok",
  //   route: "/stok",
  //   icon: <FontAwesomeIcon icon={faSitemap} className="mr-4 ml-2" />,
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Masuk",
  //       to: "/stok/masuk",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Keluar",
  //       to: "/stok/keluar",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Opname",
  //       to: "/stok/opname",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Kategori",
  //   route: "/kategori",
  //   icon: <FontAwesomeIcon icon={faList12} className="mr-4 ml-2" />,
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "List",
  //       to: "/kategori/list",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Tambah",
  //       to: "/kategori/tambah",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Pelanggan",
  //   route: "/pelanggan",
  //   icon: <FontAwesomeIcon icon={faUsers} className="mr-4 ml-2" />,
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "List",
  //       to: "/pelanggan/list",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Tambah",
  //       to: "/pelanggan/tambah",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Supplier",
  //   route: "/supplier",
  //   icon: <FontAwesomeIcon icon={faHouse} className="mr-4 ml-2" />,
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "List",
  //       to: "/supplier/list",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Tambah",
  //       to: "/supplier/tambah",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Unit",
  //   route: "/unit",
  //   icon: <FontAwesomeIcon icon={faBoxes} className="mr-4 ml-2" />,
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "List",
  //       to: "/unit/list",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Tambah",
  //       to: "/unit/tambah",
  //     },
  //   ],
  // },
];
