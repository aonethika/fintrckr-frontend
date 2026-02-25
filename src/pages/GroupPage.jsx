import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { fetchGroupById } from '../redux/slices/groupSlice';
import GroupInfoModal from '../components/GroupInfoModal';
import AddSplitModal from '../components/AddSplitModal';
import ChatArea from '../components/ChatArea'
import '../styles/chatArea.css'

function GroupPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  const group = useSelector(state => state.groups.currentGroup);
  const currentUser = useSelector(state => state.auth.user);
  // console.log("status",group.name, group.status);
  

  const [openInfo, setOpenInfo] = useState(false);
  const [openSpliForm, setOpenSplitForm] = useState(false);

  useEffect(() => {
    dispatch(fetchGroupById(groupId));
  }, [groupId]);

  return (
    <div className='grp-page'>
      <Header
        group={group}
        openInfo={() => setOpenInfo(true)}
        openSplit={() => setOpenSplitForm(true)}
        showAddSplitButton={!openInfo && !openSpliForm}
      />
      <ChatArea />
      {openInfo && (
        <GroupInfoModal group={group} onClose={() => setOpenInfo(false)} />
      )}

      {openSpliForm && (
        <AddSplitModal group={group} onClose={() => setOpenSplitForm(false)} />
      )}
    </div>
  );
}

export default GroupPage;
