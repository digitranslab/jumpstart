import React, { useState, useCallback, useRef, useEffect } from 'react';
import cx from 'classnames';
import SolidIcon from '@/_ui/Icon/SolidIcons';
import { ToolTip } from '@/_components/ToolTip';
import { useTranslation } from 'react-i18next';
import { ButtonSolid } from '@/_ui/AppButton/AppButton';
import { toast } from 'react-hot-toast';
import { FileDropzone } from './FileDropzone';
import { USER_DRAWER_MODES } from '@/_helpers/utils';
import { UserGroupsSelect } from './UserGroupsSelect';

function InviteUsersForm({
  onClose,
  manageUser,
  changeNewUserOption,
  errors,
  fields,
  handleFileChange,
  uploadingUsers,
  onCancel,
  inviteBulkUsers,
  groups = [],
  currentEditingUser,
  userDrawerMode,
  setUserValues,
  creatingUser,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [existingGroups, setExistingGroups] = useState([]);

  const hiddenFileInput = useRef(null);

  const darkmode = localStorage.getItem('darkMode') === 'true';

  useEffect(() => {
    if (currentEditingUser && groups.length) {
      const { first_name, last_name, email, groups: addedToGroups } = currentEditingUser;
      setUserValues({
        fullName: `${first_name}${last_name && ` ${last_name}`}`,
        email: email,
      });
      const preSelectedGroups = groups
        .filter((group) => addedToGroups.includes(group.value))
        .map((filteredGroup) => ({
          ...filteredGroup,
          label: filteredGroup.name,
        }));
      setExistingGroups(groups.filter((group) => addedToGroups.includes(group.value)).map((g) => g.value));
      onChangeHandler(preSelectedGroups);
    }
  }, [currentEditingUser, groups]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (Math.round(file.size / 1024) > 1024) {
      toast.error('File size cannot exceed more than 1MB');
    } else {
      handleFileChange(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const onChangeHandler = (items) => {
    setSelectedGroups(items);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const selectedGroupsIds = selectedGroups.map((group) => group.value);
    manageUser(currentEditingUser?.id, selectedGroupsIds);
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    const selectedGroupsIds = selectedGroups.map((group) => group.value);
    const newGroupsToAdd = selectedGroupsIds.filter((selectedGroupId) => !existingGroups.includes(selectedGroupId));
    const groupsToRemove = existingGroups.filter((existingGroup) => !selectedGroupsIds.includes(existingGroup));
    manageUser(currentEditingUser.id, selectedGroupsIds, newGroupsToAdd, groupsToRemove);
  };

  const getEditedGroups = () => {
    const selectedGroupsIds = selectedGroups.map((group) => group.value);
    const newGroupsToAdd = selectedGroupsIds.filter((selectedGroupId) => !existingGroups.includes(selectedGroupId));
    const groupsToRemove = existingGroups.filter((existingGroup) => !selectedGroupsIds.includes(existingGroup));
    return { newGroupsToAdd, groupsToRemove };
  };

  const isEdited = () => {
    const { newGroupsToAdd, groupsToRemove } = getEditedGroups();
    const { first_name, last_name } = currentEditingUser || {};
    return isEditing
      ? fields['fullName'] !== `${first_name}${last_name && ` ${last_name}`}` ||
          groupsToRemove.length ||
          newGroupsToAdd.length
      : true;
  };

  const isEditing = userDrawerMode === USER_DRAWER_MODES.EDIT;
  let fillColor;
  if (activeTab == 1) {
    fillColor = darkmode ? '#FFFFFF' : '#11181C';
  } else {
    fillColor = darkmode ? '#AAAAAA' : '#687076';
  }

  return (
    <div>
      <div className="animation-fade invite-user-drawer-wrap">
        <div className="drawer-card-wrap invite-user-drawer-wrap">
          <div className="card-header">
            <div className="card-header-inner-wrap">
              <h3 className="tj-text-lg tj-text font-weight-500" data-cy="add-users-card-title">
                {!isEditing
                  ? t('header.organization.menus.manageUsers.addNewUser', 'Add new user')
                  : 'Edit user details'}
              </h3>
              <div
                onClick={() => {
                  onCancel();
                  onClose();
                }}
                style={{ cursor: 'pointer' }}
                data-cy="close-button"
              >
                <SolidIcon name="remove" width="16" />
              </div>
            </div>
            {!isEditing && (
              <div className="tj-drawer-tabs-container-outer">
                <div className="tj-drawer-tabs-container">
                  <button
                    className={`tj-drawer-tabs-btn tj-text-xsm ${activeTab == 1 && 'tj-drawer-tabs-btn-active'}`}
                    onClick={() => setActiveTab(1)}
                    data-cy="button-invite-with-email"
                  >
                    <SolidIcon name="mail" width="14" fill={fillColor} />
                    <span> Invite with email</span>
                  </button>
                  <button
                    className={`tj-drawer-tabs-btn  tj-text-xsm ${activeTab == 2 && 'tj-drawer-tabs-btn-active'}`}
                    onClick={() => setActiveTab(2)}
                    data-cy="button-upload-csv-file"
                  >
                    <SolidIcon name="fileupload" width="14" fill={fillColor} />
                    <span>Upload CSV file</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {activeTab == 1 ? (
            <div className="manage-users-drawer-content">
              <div className="invite-user-by-email">
                <form
                  onSubmit={isEditing ? handleEditUser : handleCreateUser}
                  noValidate
                  className="invite-email-body"
                  id="inviteByEmail"
                >
                  <label className="form-label" data-cy="label-full-name-input-field">
                    Name
                  </label>
                  <div className="form-group mb-3 ">
                    <ToolTip
                      delay={{ show: '0', hide: '0' }}
                      placement="bottom"
                      message="Only user can edit their name"
                      show={isEditing}
                    >
                      <div className="tj-app-input">
                        <input
                          type="text"
                          className={cx('form-control', { disabled: isEditing })}
                          placeholder={t('header.organization.menus.manageUsers.enterFullName', 'Enter full name')}
                          name="fullName"
                          onChange={changeNewUserOption.bind(this, 'fullName')}
                          value={fields['fullName']}
                          data-cy="input-field-full-name"
                          disabled={isEditing}
                        />
                        <span className="text-danger" data-cy="error-message-fullname">
                          {errors['fullName']}
                        </span>
                      </div>
                    </ToolTip>
                  </div>
                  <div className="form-group mb-3 ">
                    <label className="form-label" data-cy="label-email-input-field">
                      {t('header.organization.menus.manageUsers.emailAddress', 'Email Address')}
                    </label>
                    <ToolTip
                      delay={{ show: '0', hide: '0' }}
                      placement="bottom"
                      message="Cannot edit user email address"
                      show={isEditing}
                    >
                      <div className="tj-app-input">
                        <input
                          type="text"
                          className={cx('form-control', { disabled: isEditing })}
                          aria-describedby="emailHelp"
                          placeholder={t('header.organization.menus.manageUsers.enterEmail', 'Enter Email')}
                          name="email"
                          onChange={changeNewUserOption.bind(this, 'email')}
                          value={fields['email']}
                          data-cy="input-field-email"
                          disabled={isEditing}
                        />
                        <span className="text-danger" data-cy="error-message-email">
                          {errors['email']}
                        </span>
                      </div>
                    </ToolTip>
                  </div>
                  <div className="form-group mb-3 manage-groups-invite-form" data-cy="user-group-select">
                    <label className="form-label" data-cy="label-group-input-field">
                      {isEditing
                        ? 'User groups'
                        : t('header.organization.menus.manageUsers.selectGroup', 'Select Group')}
                    </label>
                    <UserGroupsSelect value={selectedGroups} onChange={onChangeHandler} options={groups} />
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="manage-users-drawer-content-bulk">
              <div className="manage-users-drawer-content-bulk-download-prompt">
                <div className="user-csv-template-wrap">
                  <div>
                    <SolidIcon name="information" fill="#F76808" width="26" />
                  </div>
                  <div>
                    <p className="tj-text tj-text-sm" data-cy="helper-text-bulk-upload">
                      Download the ToolJet template to add user details or format your file in the same as the template.
                      ToolJet won’t be able to recognise files in any other format.{' '}
                    </p>
                    <ButtonSolid
                      href="../../assets/csv/sample_upload.csv"
                      download="sample_upload.csv"
                      variant="tertiary"
                      className="download-template-btn"
                      as={'a'}
                      leftIcon="folderdownload"
                      iconWidth="13"
                      data-cy="button-download-template"
                    >
                      Download Template
                    </ButtonSolid>
                  </div>
                </div>
              </div>
              <FileDropzone
                handleClick={handleClick}
                hiddenFileInput={hiddenFileInput}
                errors={errors}
                handleFileChange={handleFileChange}
                inviteBulkUsers={inviteBulkUsers}
                onDrop={onDrop}
              />
            </div>
          )}
          <div className="manage-users-drawer-footer">
            <ButtonSolid
              data-cy="cancel-button"
              onClick={() => {
                onCancel();
                onClose();
              }}
              variant="tertiary"
            >
              {t('globals.cancel', 'Cancel')}
            </ButtonSolid>

            <ButtonSolid
              form={activeTab == 1 ? 'inviteByEmail' : 'inviteBulkUsers'}
              type="submit"
              variant="primary"
              disabled={uploadingUsers || creatingUser || !isEdited()}
              data-cy={activeTab == 1 ? 'button-invite-users' : 'button-upload-users'}
              leftIcon={activeTab == 1 ? 'sent' : 'fileupload'}
              width="20"
              fill={'#FDFDFE'}
              isLoading={uploadingUsers || creatingUser}
            >
              {!isEditing
                ? activeTab == 1
                  ? t('header.organization.menus.manageUsers.inviteUsers', 'Invite Users')
                  : 'Upload users'
                : 'Update'}
            </ButtonSolid>
          </div>
        </div>
      </div>
    </div>
  );
}
export default InviteUsersForm;