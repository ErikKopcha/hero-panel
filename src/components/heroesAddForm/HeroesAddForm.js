import { useSelector } from "react-redux";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {useCreateHeroMutation, useGetFiltersQuery} from "../../redux/slices/apiSlice";
import { selectAll } from "../../redux/slices/filtersSlice";
import store from "../../redux/store";

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState('');
    const [heroDesc, setHeroDesc] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const [createHero, { isLoading }] = useCreateHeroMutation();

    const {
        data: filters = [],
        isLoading: filtersIsLoading,
        isError
    } = useGetFiltersQuery();

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDesc,
            element: heroElement
        }

        createHero(newHero).unwrap();

        setHeroName('');
        setHeroDesc('');
        setHeroElement('');
    }

    const getFilters = (filters) => {
        if (filtersIsLoading) {
            return <option>Loading...</option>
        }

        if (isError) {
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
                    { getFilters(filters) }
                </select>
            </div>

            <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary">
                Create
            </button>
        </form>
    )
}

export default HeroesAddForm;