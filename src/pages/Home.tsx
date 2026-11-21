
import AutoScrollModal from "@/components/AutoScrollModal";
import WorkspaceComment   from  "@/components/WorkspaceComment"
const Home = () => {
return (
  <div className="relative mx-auto mt-4 h-[400px] w-full min-w-0 max-w-6xl px-3 py-3 sm:mt-6 sm:h-[500px] sm:px-5 sm:py-5 lg:mt-10 lg:h-[550px] lg:px-6">
  <AutoScrollModal photo="CollabFlow-HomePage.avif">
    <div className="mt-4 min-w-0 sm:mt-6">
      <WorkspaceComment />
    </div>
  </AutoScrollModal>
</div>
);
}

export default Home;
