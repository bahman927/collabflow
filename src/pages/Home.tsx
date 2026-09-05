
import AutoScrollModal from "@/components/AutoScrollModal";
import WorkspaceComment   from  "@/components/WorkspaceComment"
const Home = () => {

  return (
  
     <div className="relative w-230 p-6 ml-30 mt-10">
        <AutoScrollModal photo="CollabFlow-HomePage.avif ">

          <div className="mt-6">
          <WorkspaceComment />
          </div>

        </AutoScrollModal>
      </div> 
            
  )
}

export default Home;
