/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/Elt_homework',
  component: Layout,
  redirect: '/Elt_homework/complex-table',
  name: 'Homework',
  meta: {
    title: '布置作业',
    icon: 'edit'
  },
  children: [
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/Elt_homework/dynamic-table/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'dynamicTable' }
    // },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/Elt_homework/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'dragTable' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/Elt_homework/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'inlineEditTable' }
    // },
    // {
    //   path: 'complex-table',
    //   component: () => import('@/views/Elt_homework/complex-table'),
    //   name: 'ComplexTable',
    //   meta: { title: '布置作业' }
    // }
  ]
}
export default tableRouter
