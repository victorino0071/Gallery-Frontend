import DraggableGallery from "@/components/gallery/DraggableGallery";
import Footer from "@/components/footer";
import Header from "@/components/header";

const HomePage = () => {

    return (
        <div>
            <Header/>
            <DraggableGallery/>
            <Footer/>
        </div>
    );
}

export default HomePage