import LoadingIndicator from 'components/elements/LoadingIndicator'
import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import AuthServices from 'services/AuthService'
import ErrorIndicator from '../ErrorIndicator'
import { USER_ROUTES } from 'routes'
import { useHistory } from 'react-router-dom'
import ModalContext from 'context/ModalContext'
import SearchBar from '../SearchBar'
import Paginator from '../Paginator'
import DeleteUserModal from 'modals/DeleteUserModal'
import NotificationContext from 'context/NotificationContext'
import CreateButton from 'components/elements/CreateButton'

const UsersTable = () => {
  const [searchPattern, setSearchPattern] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const defaultLimit = 10
  const { user } = useContext(AuthenticationContext)
  const { modalState, setModalState } = useContext(ModalContext)
  const { setNotificationState } = useContext(NotificationContext)

  const queryClient = useQueryClient()
  const { isLoading, isError, isSuccess, error, data } = useQuery(
    ['query-users', { currentPage, searchPattern, limit: 10 }],
    AuthServices.queryUsers,
    { keepPreviousData: true },
  )
  const mutation = useMutation(AuthServices.deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
  const history = useHistory()
  useEffect(() => {
    if (mutation.isSuccess) {
      setNotificationState({
        type: 'success',
        message: 'User was delete successful.',
        isShow: true,
      })
    } else if (mutation.isError) {
      setNotificationState({
        type: 'error',
        message: 'Failed at delete User.',
        isShow: true,
      })
    }
  }, [mutation.status])
  const onDeleteUser = (userId) => {
    setModalState({ ...modalState, isModalOpen: true, openDeleteUserModal: true, userId: userId })
  }
  const onEditUser = (userId) => {
    history.push(`${USER_ROUTES.LIST_USERS}/${userId}`)
  }

  const onCreateUser = () => {
    history.push(USER_ROUTES.CREATE_USER)
  }

  return (
    <div className="w-full">
      {isLoading && <LoadingIndicator style="w-12 h-12 center-content" />}
      {/* TODO: display error inside data table */}
      {isError && <ErrorIndicator error={error} />}
      {isSuccess && (
        <>
          <SearchBar searchPattern={searchPattern} setSearchPattern={setSearchPattern} />
          <CreateButton onClick={onCreateUser} />
          <div className="bg-lightGray">
            <div className="flex flex-row text-xl font-medium text-gray-600 uppercase">
              <div className="w-1/12 px-6 py-6">Index</div>
              <div className="w-1/4 px-6 py-6">Username</div>
              <div className="w-1/4 px-6 py-6">Email</div>
              <div className="w-1/4 px-6 py-6">Full name</div>
              <div className="w-1/6 px-6 py-6">Actions</div>
            </div>
          </div>
          <div className="w-full overflow-x-hidden overflow-y-auto bg-white max-h-500px">
            {data.results.length > 0 ? (
              data.results.map((user, index) => (
                <div key={user.id} className="flex border-b border-gray-200">
                  <div className="w-1/12 px-6 py-6 ">{index + 1}</div>
                  <div className="w-1/4 px-6 py-6">{user.username}</div>
                  <div className="w-1/4 px-6 py-6 ">{user.email}</div>
                  <div className="w-1/4 px-6 py-6 ">
                    {user.first_name || user.last_name ? user.first_name + user.last_name : 'No Data'}
                  </div>
                  <div className="w-1/6 px-6 py-6 ">
                    <button
                      type="button"
                      className="font-medium text-red-500 uppercase hover:underline hover:text-red-400"
                      onClick={() => onDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="ml-6 font-medium text-blue-500 uppercase hover:underline hover:text-blue-400"
                      onClick={() => onEditUser(user.id)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-row items-center justify-center text-3xl text-red-500 h-400px">
                <p className="text-red-600 ">No record found</p>
              </div>
            )}
          </div>
          <div className="flex flex-row items-center justify-between w-full mt-10">
            <div className="text-2xl text-gray-700">
              <p>{`Showing ${data.results.length} of ${data.count} records.`}</p>
            </div>
            {defaultLimit !== data.results.count ? (
              !data.previous || !data.next || (data.next && data.previous) ? (
                <Paginator
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  count={data.count}
                  next={data.next}
                  previous={data.previous}
                  limit={defaultLimit}
                />
              ) : null
            ) : null}
          </div>
        </>
      )}
      {modalState.isModalOpen && modalState.openDeleteUserModal && <DeleteUserModal mutation={mutation} />}
    </div>
  )
}

export default UsersTable
