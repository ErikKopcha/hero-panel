import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { heroCreated } from "../../redux/slices/heroesSlice";
import { selectAll } from "../../redux/slices/filtersSlice";
import store from "../../redux/store";

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState('');
    const [heroDesc, setHeroDesc] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const dispatch = useDispatch();
    const { filtersLoadingStatus } = useSelector(state => state.filters);
    const { request } = useHttp();
    const filters = selectAll(store.getState());

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDesc,
            element: heroElement
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => {dispatch(heroCreated(newHero))})
            .catch(err => console.log(err));

        setHeroName('');
        setHeroDesc('');
        setHeroElement('');
    }

    const getFilters = (filters, status) => {
        switch (status) {
            case 'loading':
                return <option>Loading...</option>
            case 'error':
                return <option>Error loading</option>
        }

        if (filters && filters.length) {
            return filters.map(({name, label}) => {
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Hero name</label>
                <input
                    onChange={({ target }) => setHeroName(target.value)}
                    value={heroName}
                    required
                    autoComplete="off"
                    type="text"
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="What is my name?"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Description</label>
                <textarea
                    onChange={({ target }) => setHeroDesc(target.value)}
                    value={heroDesc}
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="What can I do?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Select hero element</label>
                <select
                    onChange={({ target }) => setHeroElement(target.value)}
                    value={heroElement}
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                >
                    <option value="">select element</option>
                    { getFilters(filters, filtersLoadingStatus) }
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}

export default HeroesAddForm;